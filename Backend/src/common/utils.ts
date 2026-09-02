//TODO clean up dead boilerplate code
// import fs from "fs";
// import mime from "mime-types";
import dotenv from "dotenv";
// import fetch from "node-fetch";
// import base64arraybuffer from "base64-arraybuffer";
// import { ToWords } from "to-words";

//TODO figure out why import statement doesnt work
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

dotenv.config();

export class Util {
  //   static async convertToBase64(file: string): Promise<string> {
  //     const imageAsBase64 = fs.readFileSync(file, "base64");
  //     const mimeType = mime.lookup(file) || "application/octet-stream";
  //     return `data:${mimeType};base64,${imageAsBase64}`;
  //   }

  //TODO try to make this asynchronus
 static hashPassword(plainPassword: string): string {
  const rounds = Number(process.env.BcryptHashRound) || 10;
  return bcrypt.hashSync(plainPassword, rounds);
}

  //TODO try to make this asynchronus
  static comparePassword(plainPassword: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  }

  //   static async convertToBase64FromUrl(fileUrl: string): Promise<string> {
  //     const arrayBuffer = await fetch(fileUrl).then(res => res.arrayBuffer());
  //     const base64 = base64arraybuffer.encode(arrayBuffer);
  //     let mimeType = "image/png";

  //     if (fileUrl.includes(".jpg")) {
  //       mimeType = "image/jpg";
  //     } else if (fileUrl.includes(".jpeg")) {
  //       mimeType = "image/jpeg";
  //     } else if (fileUrl.includes(".svg")) {
  //       mimeType = "image/svg+xml";
  //     }

  //     return `data:${mimeType};base64,${base64}`;
  //   }

  static formatNumber(num: number | string | null): string {
    if (!num) return "";
    if (typeof num === "string") num = parseFloat(num);
    return num.toLocaleString("en-US");
  }

  //   static numberToWord(num: number | string): string {
  //     if (typeof num === "string") num = parseFloat(num);

  //     const toWords = new ToWords({
  //       localeCode: "en-US",
  //       converterOptions: {
  //         currency: false,
  //         ignoreDecimal: false,
  //         ignoreZeroCurrency: false,
  //         doNotAddOnly: false,
  //         currencyOptions: {
  //           name: "Birr",
  //           plural: "Birr",
  //           symbol: "ብር",
  //           fractionalUnit: { name: "Santim", plural: "Santim", symbol: "" },
  //         },
  //       },
  //     });

  //     return toWords.convert(num);
  //   }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static padDigits(number: number, numDigits = 4): string {
    return number.toString().padStart(numDigits, "0");
  }

  static getChangePercentage(newValue: number | string, oldValue: number | string): string {
    newValue = parseFloat(newValue.toString());
    oldValue = parseFloat(oldValue.toString());

    if (oldValue === 0) return "N/A";
    const change = ((newValue - oldValue) / oldValue) * 100;
    let arrow = "";

    if (change > 0) arrow = "▲";
    else if (change < 0) arrow = "▼";
    else return `<span style="color:black;"> no change from </span>`;

    return `<span style="color: ${change > 0 ? "green" : "red"}">${change.toFixed(0)}% ${arrow}</span> from`;
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  static formatDateWithDayName(date: Date): string {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  static generateToken(data: object, expiresIn: string = "1h"): string {
    return jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn });
  }

  static addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  static getCharFromNumber(columnNumber: number): string {
    let dividend = columnNumber;
    let columnName = "";
    let modulo: number;

    while (dividend > 0) {
      modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - modulo) / 26);
    }

    return columnName;
  }

  static generateRefreshToken(user: object, expiresIn: string = "365d"): string {
    return jwt.sign(user, process.env.REFRESH_SECRET_TOKEN as string, { expiresIn });
  }

  static generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static decodeVehicle(data: { side_number?: string; plate_number?: string; trailer_plate_number?: string; trailer?: { plate_number?: string } } | null): string {
    return `${data?.side_number ? `${data.side_number} - (` : ""}${data?.plate_number ?? ""}${data?.trailer_plate_number || data?.trailer?.plate_number
      ? `/${data.trailer_plate_number || data.trailer?.plate_number}${data.side_number ? ")" : ""}`
      : data?.side_number ? ")" : ""
      }`;
  }
}
