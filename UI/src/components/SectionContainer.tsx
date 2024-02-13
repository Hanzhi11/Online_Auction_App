interface Props {
    children: JSX.Element | JSX.Element[],
    header: string
}

function SectionContainer(props: Props) {
    return (
        <div className="w-full md:w-[720px] md:px-0 lg:w-[940px] xl:w-[1140px] mx-auto mt-3 md:mt-9 px-[4%] text-stone-800" >
            <h1 className="border-b border-stone-400 font-light pb-4 md:pb-6 text-lg md:text-3xl mb-5">{props.header}</h1>
            {props.children}
        </div>
    )
}

export default SectionContainer