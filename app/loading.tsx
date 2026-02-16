export default function Loading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                <p className="text-neutral-400 animate-pulse">Loading Deriverse data...</p>
            </div>
        </div>
    );
}
