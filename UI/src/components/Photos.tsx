import { useContext, useEffect, useState } from 'react';
import Button from './Button';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { WindowSizeContext } from '../App';
import { ELEMENT_ID } from '../shared/Constants';

interface Props {
    photos: string[];
}

function Photos(props: Props) {
    const windowSize = useContext(WindowSizeContext);
    const { photos } = props;
    const [photoIndex, setPhotoIndex] = useState<number>(0);
    const [photoBarOffset, setPhotoBarOffset] = useState<number>(0);
    const [showPhotoBarButtons, setShowPhotoBarButtons] = useState({
        left: false,
        right: true,
    });

    const [photoBarContainerWidth, setPhotoBarContainerWidth] = useState(0);

    useEffect(() => {
        const photoBar = document.getElementById('photoBar');
        const photoBarContainer = document.getElementById('photoBarContainer');
        if (!photoBar || !photoBarContainer) {
            return;
        }
        let isShowPhotoBarRightButton = false;
        if (photoBar.scrollWidth > photoBarContainer.clientWidth) {
            isShowPhotoBarRightButton = true;
        }
        setShowPhotoBarButtons({
            left: false,
            right: isShowPhotoBarRightButton,
        });

        const newWidth = photoBarContainer.clientWidth;
        setPhotoBarContainerWidth(newWidth);
    }, []);

    useEffect(() => {
        const photoBarContainer = document.getElementById('photoBarContainer');
        if (!photoBarContainer) {
            return;
        }
        const newWidth = photoBarContainer.clientWidth;
        setPhotoBarContainerWidth(newWidth);
        const photoBar = document.getElementById('photoBar');
        if (!photoBar) {
            return;
        }
        if (
            photoBar.scrollWidth < newWidth ||
            photoBar.scrollWidth === newWidth
        ) {
            setPhotoBarOffset(0);
        }
    }, [windowSize]);

    useEffect(() => {
        const photoBar = document.getElementById('photoBar');
        if (!photoBar) {
            return;
        }
        let isShowPhotoBarLeftButton = false;
        let isShowPhotoBarRightButton = false;

        if (photoBarOffset < 0) {
            isShowPhotoBarLeftButton = true;
        }

        if (
            photoBarContainerWidth - photoBarOffset <
            (photoBar as HTMLElement).scrollWidth
        ) {
            isShowPhotoBarRightButton = true;
        }

        setShowPhotoBarButtons({
            left: isShowPhotoBarLeftButton,
            right: isShowPhotoBarRightButton,
        });
    }, [photoBarContainerWidth, photoBarOffset]);

    const handlePhotoBarScroll = (event: React.MouseEvent<Element>) => {
        const target = event.target as HTMLElement;
        let button: HTMLButtonElement | null;
        if (target.tagName !== 'BUTTON') {
            button = target.closest('button');
        } else {
            button = target as HTMLButtonElement;
        }
        if (!button) {
            return;
        }

        let newOffset = photoBarOffset;
        const photoBar = document.getElementById('photoBar');
        if (!photoBar) {
            return;
        }
        let remainingWidth;
        const increment = 80;
        switch (button.id) {
            case ELEMENT_ID.PHOTO_BAR_BACK:
                if (newOffset < -increment) {
                    newOffset = newOffset + increment;
                } else {
                    newOffset = 0;
                }
                break;
            case ELEMENT_ID.PHOTO_BAR_FORWARD:
                remainingWidth =
                    (photoBar as HTMLElement).scrollWidth -
                    photoBarContainerWidth +
                    newOffset;
                if (remainingWidth > increment) {
                    newOffset = newOffset - increment;
                } else {
                    newOffset = newOffset - remainingWidth;
                }
                break;
        }
        setPhotoBarOffset(newOffset);
    };

    const handlePhotoChange = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        let button: HTMLElement | null = target;
        if (button.tagName !== 'BUTTON') {
            button = target.closest('button');
        }

        if (!button) {
            return;
        }

        let newPhotoIndex = photoIndex;
        switch (button.id) {
            case ELEMENT_ID.PHOTO_BACK:
                newPhotoIndex--;
                if (newPhotoIndex < 0) {
                    newPhotoIndex = 0;
                }
                break;
            case ELEMENT_ID.PHOTO_FORWARD:
                newPhotoIndex++;
                if (newPhotoIndex > photos.length - 1) {
                    newPhotoIndex = photos.length - 1;
                }
                break;
        }
        setPhotoIndex(newPhotoIndex);
    };

    return (
        <div className='h-full'>
            <p className='absolute left-5 top-7 text-white'>
                {photoIndex + 1}/{photos.length}
            </p>
            <div className='relative mt-[10vh] h-4/5 max-h-80 min-h-48 p-5 md:h-fit md:max-h-fit'>
                {photoIndex !== 0 ? (
                    <Button
                        id={ELEMENT_ID.PHOTO_BACK}
                        height='h-10'
                        width='w-10'
                        onClick={handlePhotoChange}
                        className='bg-indigo-900 rounded-full bg-opacity-50 absolute left-5 top-1/2 -translate-y-2/4'
                    >
                        <IoIosArrowBack />
                    </Button>
                ) : (
                    <></>
                )}
                <img
                    src={`data:image/jpeg;base64,${photos[photoIndex]}`}
                    className=' mx-auto aspect-[3/2] h-full object-cover md:h-auto md:w-full md:max-w-[1028px]'
                />
                {photoIndex !== photos.length - 1 ? (
                    <Button
                        id={ELEMENT_ID.PHOTO_FORWARD}
                        height='h-10'
                        width='w-10'
                        onClick={handlePhotoChange}
                        className='bg-indigo-900 rounded-full bg-opacity-50 absolute right-5 top-1/2 -translate-y-2/4'
                    >
                        <IoIosArrowForward />
                    </Button>
                ) : (
                    <></>
                )}
            </div>
            <div
                id='photoBarContainer'
                className='relative mx-5 flex justify-center overflow-hidden md:mt-20 md:pb-20'
            >
                {showPhotoBarButtons.left && (
                    <Button
                        id={ELEMENT_ID.PHOTO_BAR_BACK}
                        height='h-16'
                        width='w-7'
                        onClick={handlePhotoBarScroll}
                        className='z-10 bg-indigo-900 rounded-none absolute left-0'
                    >
                        <IoIosArrowBack />
                    </Button>
                )}
                <div
                    id='photoBar'
                    className='relative flex'
                    style={{ left: `${photoBarOffset}px` }}
                >
                    {photos.map((photo, index) => {
                        let opacity = 'opacity-30';
                        if (index === photoIndex) {
                            opacity = '';
                        }
                        return (
                            <img
                                key={index}
                                src={`data:image/jpeg;base64,${photo}`}
                                className={
                                    'mr-3 aspect-[3/2] h-16 cursor-pointer object-cover last-of-type:mr-0 md:h-20 ' +
                                    opacity
                                }
                                onClick={() => setPhotoIndex(index)}
                            />
                        );
                    })}
                </div>
                {showPhotoBarButtons.right && (
                    <Button
                        id={ELEMENT_ID.PHOTO_BAR_FORWARD}
                        height='h-16'
                        width='w-7'
                        onClick={handlePhotoBarScroll}
                        className='z-10 bg-indigo-900 rounded-none'
                    >
                        <IoIosArrowForward />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Photos;
