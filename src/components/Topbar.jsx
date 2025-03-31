const Topbar = () => {
    return (
      <div className="ml-64 bg-white shadow h-16 flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Welcome Back!</h1>
        <div>
          <button className="bg-gray-200 rounded px-4 py-1">Logout</button>
        </div>
      </div>
    );
  };
  
  export default Topbar;
  