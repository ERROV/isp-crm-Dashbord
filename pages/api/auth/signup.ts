import type { NextApiRequest, NextApiResponse } from 'next';
import type mongoose from 'mongoose';
import type { User as IUser, Role as IRole } from '../../../types';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import Role from '../../../models/Role';
import { Permission } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await dbConnect();

  const { name, email, password } = req.body;

  if (!name || !email || !password || password.trim().length < 6) {
    return res.status(422).json({ message: 'Invalid input.' });
  }

  const existingUser = await (User as mongoose.Model<IUser>).findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(422).json({ message: 'User exists already!' });
  }

  // Find or create the default "Client" role
  let clientRole = await (Role as mongoose.Model<IRole>).findOne({ name: 'roles.3' });
  if (!clientRole) {
    clientRole = new (Role as mongoose.Model<IRole>)({
      name: 'roles.3',
      permissions: [
        Permission.VIEW_DASHBOARD, 
        Permission.VIEW_TICKETS_OWN, 
        Permission.CREATE_TICKET, 
        Permission.VIEW_KNOWLEDGEBASE,
        Permission.VIEW_TIME_OFF,
        Permission.MANAGE_TIME_OFF,
      ]
    });
    await clientRole.save();
  }

  const newUser = new (User as mongoose.Model<IUser>)({
    name,
    email: email.toLowerCase(),
    password,
    role: clientRole._id,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Created user!' });
  } catch (error) {
    res.status(500).json({ message: 'Creating user failed.' });
  }
}