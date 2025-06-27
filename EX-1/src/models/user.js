import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

// Q1 - User and Profile
const User = sequelize.define("User", {
    name: DataTypes.STRING,
});

const Profile = sequelize.define("Profile", {
    bio: DataTypes.STRING,
});

User.hasOne(Profile);
Profile.belongsTo(User);

// Q2 - Book and Author
const Author = sequelize.define("Author", {
    name: DataTypes.STRING,
});

const Book = sequelize.define("Book", {
    title: DataTypes.STRING,
});

Book.hasMany(Author);
Author.belongsTo(Book);

// Q4 - Employee and Manager
const Employee = sequelize.define("Employee", {
    name: DataTypes.STRING,
});

const Manager = sequelize.define("Manager", {
    name: DataTypes.STRING,
});

Employee.hasOne(Manager);
Manager.belongsTo(Employee);

// ========== SYNC DATABASE ==========
await sequelize.sync();

// Q1- Broken Code 1 - FIXED CODE
const user1 = await User.create({ name: 'joe' });
const profile1 = await user1.createProfile({ bio: 'Test' });
await user1.setProfile(profile1);

// Q2- Broken Code 2 - FIXED CODE
const book = await Book.create({ title: 'Wrong way' });
const author = await book.createAuthor({ name: 'Samnang' });
await author.setBook(book);

// Q3- Broken Code 3 - FIXED CODE
const user2 = await User.create({ name: 'jon' });
const profile2 = await Profile.create({ bio: 'hello' });
await user2.setProfile(profile2);

// TODO - Export the model User
export { User, Profile, Author, Book, Employee, Manager };