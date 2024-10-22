'use client';

import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
    children: React.ReactNode;
};

export const FadeInBottom: React.FC<Props> = ({ children }) => {
    const { ref: inViewRef, inView } = useInView({
        rootMargin: "-50px",
        triggerOnce: true,
    });

    const fadeInClassName = inView ? "animate-fade-in-bottom" : "opacity-0";

    const childRef = useRef<HTMLElement | null>(null);

    const setRefs = React.useCallback(
        (node: HTMLElement | null) => {
            childRef.current = node;
            inViewRef(node);
        },
        [inViewRef]
    );

    useEffect(() => {
        if (childRef.current) {
            if (inView) {
                childRef.current.classList.add(fadeInClassName);
            } else {
                childRef.current.classList.remove(fadeInClassName);
            }
        }
    }, [inView, fadeInClassName]);

    return React.cloneElement(React.Children.only(children) as React.ReactElement, {
        ref: setRefs,
    });
};