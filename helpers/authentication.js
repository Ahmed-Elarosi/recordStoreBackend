import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

import { promisify } from 'util';

export const signJWT = promisify(sign);
export const verifyJWT = promisify(verify);

/*
const signWithPromise = () => new Promise((resolve, reject) => {
            sign({ works: true }, 'secret', (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        })
        const token = await signWithPromise;
        console.log(token);
*/
