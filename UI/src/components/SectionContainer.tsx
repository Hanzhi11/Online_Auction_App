import classNames from 'classnames';

interface Props {
    children: JSX.Element | JSX.Element[];
    header?: string;
    className?: string;
}

function SectionContainer(props: Props) {
    const { header, className } = props;
    const styles = classNames(
        'w-full md:w-[720px] md:px-0 lg:w-[940px] xl:w-[1140px]',
        {
            'mx-auto mt-3 md:mt-9': header,
        },
        className,
    );
    return (
        <section className={styles}>
            {header && (
                <h4 className='border-b border-stone-400 font-light py-4 md:pb-6 md:text-3xl mb-5'>
                    {header}
                </h4>
            )}
            {props.children}
        </section>
    );
}

export default SectionContainer;
