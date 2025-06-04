import { prisma } from '../database/database';

export class StatisticsService {
    static async getUserStatistics(userId: number) {
        // Ejemplo: número de libros creados por el usuario
        const booksCount = await prisma.book.count({
            where: { idUser: userId },
        });

        // Puedes añadir más estadísticas aquí
        return { booksCount };
    }

    static async getClubStatistics(clubId: number) {
    const membersCount = await prisma.clubMember.count({ where: { idClub: clubId } });
    const booksCount = await prisma.clubBook.count({ where: { idClub: clubId } });
    return { membersCount, booksCount };
  }
}
