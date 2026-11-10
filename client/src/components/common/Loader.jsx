import './Loader.css';

function Loader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-aubergine">

            <div className="text-center">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-marigold text-3xl font-extrabold text-aubergine shadow-xl animate-pulse">
                    PI
                </div>

                <h1 className="text-2xl font-bold text-ice">
                    Public Issue Portal
                </h1>

                <p className="mt-2 text-sm text-ice/70">
                    Building a better community
                </p>

                <div className="mx-auto mt-8 h-10 w-10 animate-spin rounded-full border-4 border-ice/20 border-t-marigold">
                </div>

                <p className="mt-4 text-xs font-semibold tracking-widest text-marigold">
                    INITIALIZING...
                </p>

            </div>

        </div>
    );
}

export default Loader;