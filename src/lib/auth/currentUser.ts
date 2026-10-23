import 'server-only';

import { cache } from 'react';
import type { CurrentUser } from './types';
import { cookies } from 'next/headers';
import prisma from '../prisma/prisma';

export const getCurrentUser = cache(
  async (): Promise<CurrentUser> => {
    const cookieStore = await cookies();
    const sessionID = cookieStore.get('session')?.value;

    if (!sessionID) return null;

    const userID = (await prisma.active_sessions.findUnique({
      where: {
        session_id: sessionID,
      },
      select: {
        user_id: true,
        users: {
          select: {
            username: true,
          },
        },
      },
    }));

    if (!userID) return null;

    return { id: userID.user_id, username: userID.users.username };
  }
);