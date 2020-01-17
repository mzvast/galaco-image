import { Component } from 'react';
declare type Props = {
    src?: string;
    srcSet?: string;
    width?: string;
    height?: string;
    className?: string;
    alt?: string;
    style?: any;
    placeholderColor?: string;
    noPlaceholder?: boolean;
    retry?: any;
    noRetry?: boolean;
    noLazyLoad?: boolean;
};
declare type State = {
    loaded: boolean;
    retryCount: number;
    retryDelay: number;
    placeholder: string;
};
declare class GracefulImage extends Component<Props, State> {
    placeholderImage: any;
    throttledFunction: any;
    timeout: any;
    _isMounted: any;
    scrollElement: any;
    static defaultProps: {
        placeholderColor: string;
        retry: {
            count: number;
            delay: number;
            accumulate: string;
        };
        noRetry: boolean;
        noPlaceholder: boolean;
        noLazyLoad: boolean;
    };
    constructor(props: any);
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    registerListener: (event: any, fn: any) => void;
    clearEventListeners: () => void;
    addAnimationStyles(): void;
    setLoaded(): void;
    loadImage(): void;
    lazyLoad: () => void;
    handleImageRetries(image: any): void;
}
export default GracefulImage;
