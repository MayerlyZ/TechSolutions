import Link from 'next/link';

export default function commentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Mis comentarios</h1>
      <Link href="/comments/add">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Agregar comentario
        </button>
      </Link>
    </div>
  );
}