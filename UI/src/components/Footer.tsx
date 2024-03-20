import Logo from './Logo';
import SectionContainer from './SectionContainer';

function Footer() {
    return (
        <footer className='mt-auto bg-green-500 text-white py-7'>
            <SectionContainer className='md:grid md:grid-cols-2 text-sm px-3 md:px-0'>
                <section>
                    <Logo />
                    <p className='my-2.5'>2024© BidNow All rights reserved</p>
                </section>
                <address className='ml-auto not-italic'>
                    <p>
                        <b>for sales</b>: sales@bidnow.com.au
                    </p>
                    <p>
                        <b>for support</b>: support@bidnow.com.au
                    </p>
                    <ul className='list-disc px-6'>
                        <li>8:00am - 6:00pm AEST, Mon - Thurs</li>
                        <li>8:00am - 5:00pm AEST, Fri</li>
                        <li>9:00am - 5:00pm AEST, Sat</li>
                    </ul>
                </address>
            </SectionContainer>
        </footer>
    );
}

export default Footer;
