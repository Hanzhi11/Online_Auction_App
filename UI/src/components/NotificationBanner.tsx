import { useContext, useEffect, useRef, useState } from 'react';
import { NotificationContext } from '../App';
import classNames from 'classnames';

export default function NotificationBanner() {
    const { notificationContent, setNotificationContent } =
        useContext(NotificationContext);
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const style = classNames(
        'opacity-0 fixed bottom-0 rounded-md right-0 bg-indigo-900 text-white transition ease-in-out delay-150 duration-2000',
        {
            'px-3 py-2': notificationContent,
        },
    );

    useEffect(() => {
        if (!notificationContent) return;
        const notification = ref.current as HTMLDivElement;
        notification.classList.add('opacity-100');
        const timeOut = setTimeout(() => {
            setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timeOut)
    }, [notificationContent]);

    useEffect(() => {
        if (!isVisible) return
        const notification = ref.current as HTMLDivElement;
        notification.classList.remove('opacity-100');
        const timeOut = setTimeout(() => {
            setNotificationContent(null);
            setIsVisible(false)
        }, 2000);
        return () => clearTimeout(timeOut)
    }, [isVisible, setNotificationContent])

    return (
        <div className={style} ref={ref}>
            {notificationContent && notificationContent}
        </div>
    );
}
