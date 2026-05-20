import { useEffect, useRef } from "react";

export function useInfiniteScroll(
    onLoadMore: () => void,
    enabled: boolean
) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(!enabled) return;

        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting) onLoadMore();
            },
            { rootMargin: '200px'}
        );
        observer.observe(node);
        return ()=> observer.disconnect();
    }, [onLoadMore, enabled]);

    return sentinelRef;
}