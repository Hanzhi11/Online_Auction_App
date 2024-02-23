import Logo from "./Logo"
import SectionContainer from "./SectionContainer"

function Footer() {
    return (
        <footer className="bg-green-500 text-white flex justify-center mt-auto">
            <SectionContainer style="items-center py-7 lg:grid lg:grid-cols-2">
                    <section>
                        <Logo />
                        <p className="text-sm my-2.5">2024© BidNow All rights reserved</p>
                    </section>
                    <section className="text-sm">
                        <p><span className="font-medium">for sales</span>: sales@bidnow.com.au</p>
                        <p><span className="font-medium">for support</span>: support@bidnow.com.au</p>
                        <ul className="list-disc px-6">
                            <li>8:00am - 6:00pm AEDT, Mon - Thurs</li>
                            <li>8:00am - 5:00pm AEDT, Fri</li>
                            <li>9:00am - 5:00pm AEDT, Sat</li>
                        </ul>
                    </section>
            </SectionContainer>
        </footer>
    )
}

export default Footer