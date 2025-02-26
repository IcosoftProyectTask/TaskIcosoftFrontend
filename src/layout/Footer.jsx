export default function Footer() {
  return (
    <footer className="bg-transparent text-gray-500 text-center py-4 flex justify-center items-center mb-2">
      <p>
        Todos los derechos reservados. {new Date().getFullYear()} &copy; Icosoft.
      </p>
    </footer>
  );
}
