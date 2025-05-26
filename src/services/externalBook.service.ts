import axios from 'axios'

export class ExternalBookService {
  static async searchByTitle(title: string) {
    const response = await axios.get<{ docs: Array<{ title: string; author_name?: string[]; first_publish_year?: number; cover_i?: number; isbn?: string[] }> }>('https://openlibrary.org/search.json', {
      params: { title }
    })

    const books = response.data.docs.slice(0, 10) // solo los 10 primeros resultados útiles

    return books.map((book: any) => ({
      title: book.title,
      author: book.author_name?.[0] || 'Autor desconocido',
      publishedAt: book.first_publish_year || 2000,
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null,
      isbn: book.isbn?.[0] || null
    }))
  }
}
