import prisma from "../infrastructure/prisma";
import { Util } from "../common/utils";
import { BadRequestException } from "../infrastructure/http-exceptions";

export class AuthService {
  static async loginWithOAuth(profile: { email: string; provider: string; providerId: string; name?: string; avatarUrl?: string }) {
    const email = profile.email.toLowerCase();
    const identity = await prisma.oAuthIdentity.findUnique({ where: { provider_providerId: { provider: profile.provider, providerId: profile.providerId } }, include: { user: true } });
    let user = identity?.user || await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({ data: { email, name: profile.name, avatarUrl: profile.avatarUrl, role: "USER", oauthIdentities: { create: { provider: profile.provider, providerId: profile.providerId } } } });
        await this.createStarterData(tx, created.id);
        return tx.user.update({ where: { id: created.id }, data: { starterDataInitialized: true } });
      });
    } else if (!identity) {
      await prisma.oAuthIdentity.create({ data: { userId: user.id, provider: profile.provider, providerId: profile.providerId } });
    }
    if (!user.starterDataInitialized) {
      user = await prisma.$transaction(async (tx) => {
        const current = await tx.user.findUnique({ where: { id: user!.id }, select: { starterDataInitialized: true } });
        if (!current?.starterDataInitialized) {
          await this.createStarterData(tx, user!.id);
          return tx.user.update({ where: { id: user!.id }, data: { starterDataInitialized: true } });
        }
        return tx.user.findUniqueOrThrow({ where: { id: user!.id } });
      });
    }
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    return { accessToken: Util.generateToken(tokenPayload, "1d"), refreshToken: Util.generateRefreshToken(tokenPayload), user: { id: user.id, email: user.email, name: user.name, username: user.username, avatarUrl: user.avatarUrl, role: user.role } };
  }

  private static async createStarterData(tx: any, userId: string) {
    const workspaces = [
      {
        name: "Design System & UI", slug: `design-system-${userId.slice(0, 8)}`, description: "Component libraries, brand color tokens, typography scales, and visual guidelines.", icon: "palette", color: "#2c5e91", badgeLabel: "Design System",
        documents: [
          { title: "Button & Modal Specifications", slug: "button-modal-specifications", icon: "book-open", description: "Detailed hand-drawn specs for sketch borders, organic radii, and interaction states.", pageCount: 12, draft: "Component Specifications & Guidelines\n\n- Primary Accent: #fdd355\n- Brand Blue: #2c5e91\n- Border Rules: Solid 1.8px #30312C sketch borders" },
          { title: "Color Tokens & Typography", slug: "color-tokens-typography", icon: "palette", description: "Bricolage Grotesque and Be Vietnam Pro font hierarchy and CSS variable definitions.", pageCount: 6, draft: "Color Token Ideas:\n- Brand Yellow: #fdd355\n- Primary Blue: #2c5e91\nDrafting revised contrast guidelines for dark mode themes." },
          { title: "Mascots & Vector Assets", slug: "mascots-vector-assets", icon: "layers", description: "Fox mascot illustrations, hand-drawn arrows, signs, and background patterns.", pageCount: 8 },
        ],
      },
      {
        name: "Product Roadmap Q4", slug: `product-roadmap-q4-${userId.slice(0, 8)}`, description: "Feature specs, user stories, sprint planning canvases, and release milestones.", icon: "rocket", color: "#fdd355", badgeLabel: "Roadmap",
        documents: [
          { title: "Sprint 14 User Stories", slug: "sprint-14-user-stories", icon: "kanban", description: "Collaborative whiteboard canvas for story points, user feedback, and blockers.", pageCount: 15, draft: "Sprint 14 Retrospective:\n1. Improved canvas toolbar latency by 40%\n2. Fixed TipTap mark toggling on empty selections\n3. Need to finalize collaborative cursor color palette." },
          { title: "App Router Page Architecture", slug: "app-router-page-architecture", icon: "zap", description: "Dynamic routing layout specs, Next.js server/client component boundaries.", pageCount: 5 },
        ],
      },
      {
        name: "Creative Brainstorming", slug: `creative-brainstorming-${userId.slice(0, 8)}`, description: "Hand-drawn wireframes, mood boards, rapid prototypes, and team sketches.", icon: "pen-tool", color: "#e48358", badgeLabel: "Creative Lab",
        documents: [{ title: "Hand-Drawn Layout Exploration", slug: "hand-drawn-layout-exploration", icon: "pen-tool", description: "Organic sketch borders, hand-drawn signboards, and paper texture overlays.", pageCount: 20 }],
      },
    ];

    for (const [workspaceOrder, workspace] of workspaces.entries()) {
      await tx.workspace.create({
        data: {
          name: workspace.name, slug: workspace.slug, description: workspace.description, icon: workspace.icon, color: workspace.color, badgeLabel: workspace.badgeLabel, sortOrder: workspaceOrder,
          members: { create: { userId, role: "OWNER" } },
          documents: { create: workspace.documents.map((document, documentOrder) => ({
            authorId: userId, title: document.title, slug: document.slug, icon: document.icon, description: document.description, pageCount: document.pageCount, sortOrder: documentOrder,
            plainText: document.draft || `<h1>${document.title}</h1><p>${document.description}</p>`,
            ...(document.draft ? { draft: { create: { content: document.draft, isUnsaved: true } } } : {}),
          })) },
        },
      });
    }
  }

  static async register(payload: { email: string; password: string; name?: string }) {
    const { email, password, name } = payload;

    console.log("[AuthService.register] Received payload:", {
      email,
      passwordLength: password?.length,
      rawPassword: JSON.stringify(password),
    });

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      console.warn("[AuthService.register] Email already registered:", email);
      throw new BadRequestException("Email is already registered");
    }

    const hashedPassword = Util.hashPassword(password);
    console.log("[AuthService.register] Generated hash:", hashedPassword);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email: email.toLowerCase(), password: hashedPassword, name, role: "USER" },
      });

      // Starter data is real account data, not a client-side placeholder. It can be
      // renamed, reordered, archived, or deleted like any other workspace/document.
      await this.createStarterData(tx, newUser.id);
      await tx.user.update({ where: { id: newUser.id }, data: { starterDataInitialized: true } });
      return newUser;
    });

    console.log("[AuthService.register] User successfully saved to DB:", user.id);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = Util.generateToken(tokenPayload, "1d");
    const refreshToken = Util.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    };
  }

  static async login(payload: { email: string; password: string }) {
    const { email, password } = payload;

    console.log("[AuthService.login] Incoming login attempt:", {
      email,
      passwordLength: password?.length,
      rawPassword: JSON.stringify(password),
    });

    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    console.log("[AuthService.login] Database user lookup result:", user);

    if (!user || !user.password) {
      console.warn("[AuthService.login] User not found or missing password hash in DB");
      throw new BadRequestException("Invalid email or password");
    }

    const isValidPassword = Util.comparePassword(password, user.password);
    console.log("[AuthService.login] Password comparison result:", isValidPassword);

    if (!isValidPassword) {
      console.warn("[AuthService.login] Password comparison failed");
      throw new BadRequestException("Invalid email or password");
    }

    // Upgrade accounts created before starter data became persistent.  This runs once;
    // an empty workspace list afterwards is a deliberate user choice, not a reseed trigger.
    if (!user.starterDataInitialized) {
      await prisma.$transaction(async (tx) => {
        const currentUser = await tx.user.findUnique({ where: { id: user.id }, select: { starterDataInitialized: true } });
        if (currentUser?.starterDataInitialized) return;
        await this.createStarterData(tx, user.id);
        await tx.user.update({ where: { id: user.id }, data: { starterDataInitialized: true } });
      });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = Util.generateToken(tokenPayload, "1d");
    const refreshToken = Util.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        emailNotifications: true,
        mentionNotifications: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException("User profile not found");
    }

    return user;
  }
}

export default AuthService;
