export default function ProductSkeleton(){
  return (
    <div className="w-[260px] h-[360px] rounded-2xl bg-[#1e1e1e] animate-pulse flex flex-col overflow-hidden border border-[#2a2a2a]">
      <div className="w-full h-[220px] bg-[#242424]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 w-3/4 bg-[#242424] rounded" />
        <div className="h-3 w-1/2 bg-[#242424] rounded" />
        <div className="h-5 w-1/3 bg-[#242424] rounded" />
      </div>
    </div>
  );
}