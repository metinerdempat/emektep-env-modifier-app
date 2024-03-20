const Header = () => {
  return (
    <header className="w-full bg-gray-900 border-b border-orange-500">
      <div className="py-4 max-w-[1200px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <img
            src="https://yt3.googleusercontent.com/0DojOe3tyTKxVSB8ZsHFVTvCZUWmhvyOHZE9JtsHjnfeGAPariPxBOyAqz5DqeKfbImOLLPn=s176-c-k-c0x00ffffff-no-rj"
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <p className="text-white font-medium text-lg text-orange-500">EMektep</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
