import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const registerUser = async ({ username, email, password }) => {
    // Verifica se já existe um usuário com o email informado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw { status: 409, message: 'Email already in use' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    });

    return newUser;
};

const loginUser = async ({ username, email, password }) => {
    const user = await User.findOne(
        username ? { username } : { email }
    ).select('+password');

    if (!user) {
        throw { status: 404, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    return { user, token };
};

export default {
    registerUser,
    loginUser
};
