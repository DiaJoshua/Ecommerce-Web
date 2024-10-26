// adminController.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/adminUserModel.js';
import dotenv from 'dotenv';

dotenv.config();

const signup = async (req, res) => {
  // Signup logic
};

const login = async (req, res) => {
  // Login logic
};

const getAdminById = async (req, res) => {
  // Fetch admin by ID logic
};

const updateAdmin = async (req, res) => {
  // Update admin logic
};

// Export all functions
export {
  signup,
  login,
  getAdminById,
  updateAdmin,
};
