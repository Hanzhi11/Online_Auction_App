import className from "classnames"

interface Props {
    children: JSX.Element | JSX.Element[],
    header?: string,
    style?: string
}

function SectionContainer(props: Props) {
    const { header, style } = props
    const styles = className(style,
        'w-full md:w-[720px] md:px-0 lg:w-[940px] xl:w-[1140px] px-[4%]', {
        'mx-auto mt-3 md:mt-9': header
    }
    )
    return (
        <div className={styles} >
            {header && <h1 className="border-b border-stone-400 font-light pb-4 md:pb-6 text-lg md:text-3xl mb-5">{header}</h1>}
            {props.children}
        </div>
    )
}

export default SectionContainer