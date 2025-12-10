// import pkg from '@prisma/client';
// const { PrismaClient } = pkg;

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma;

import dotenv from 'dotenv'
dotenv.config()

// console.log(process.env.DATABASE_URL)

import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg'
// const PrismaClient = pkg.PrismaClient; // Access as property instead of destructuring

let prisma;

const adapter =  new PrismaPg({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;