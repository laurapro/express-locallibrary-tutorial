#! /usr/bin/env node

console.log("This script populates some test baby names to your database");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
const BabyName = require("./models/babyName");

const babyNames = [];

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createBabyNames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function babyNameCreate(name, gender, popularity) {
  const babyNameDetail = {
    name: name,
    gender: gender,
    popularity: popularity,
  };

  const babyName = new BabyName(babyNameDetail);
  await babyName.save();
  babyNames.push(babyName);
  console.log(`Added baby name: ${name}`);
}

async function createBabyNames() {
  console.log("Adding baby names");
  await Promise.all([
    babyNameCreate("Madeleine", "Girl", 0),
    babyNameCreate("Olivia", "Girl", 0),
    babyNameCreate("Liam", "Boy", 0),
    babyNameCreate("Morgan", "Neutral", 0),
    babyNameCreate("Owen", "Boy", 0),
  ]);
}
