import {getSession} from "next-auth/react";

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
export default prisma

function poop() {
  const result =  prisma.volunteer
}