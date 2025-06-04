import axios from 'axios'

interface OpenLibraryResponse {
    docs: {
        title: string;
        author_name?: string[];
        first_publish_year?: number;
        cover_i?: number;
        isbn?: string[];
        subject?: string[];
    }[];
}

export class ExternalBookService {
    static async searchByTitle(title: string) {
        const res = await axios.get<OpenLibraryResponse>('https://openlibrary.org/search.json', {
            params: { title }
        })

        const books = res.data.docs.slice(0, 10)

        const detailedBooks = await Promise.all(
            books.map(async (book: OpenLibraryResponse["docs"][number]) => {
                const isbn = book.isbn?.[0]
                let description = null

                if (isbn) {
                    try {
                        const detailRes = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`)
                        const detailData = detailRes.data as { description?: { value?: string } | string }
                        description =
                            typeof detailData.description === 'object'
                                ? detailData.description?.value || null
                                : detailData.description || null
                    } catch {
                        description = null
                    }
                }

                return {
                    title: book.title,
                    author: book.author_name?.[0] || 'Autor desconocido',
                    publishedAt: book.first_publish_year || 2000,
                    coverUrl: book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                        : null,
                    isbn: isbn || null,
                    genre: book.subject?.[0] || 'General',
                    description: description || 'Sin descripción'
                }
            })
        )

        return detailedBooks
    }


    
}
