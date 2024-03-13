import Logo from './Logo';
import SectionContainer from './SectionContainer';

function Footer() {
    return (
        <footer className='mt-auto flex justify-center bg-green-500 text-white'>
            <SectionContainer className='items-center py-7 lg:grid lg:grid-cols-2 px-7'>
                <section>
                    <Logo />
                    <p className='my-2.5 text-sm'>
                        2024© BidNow All rights reserved
                    </p>
                </section>
                <section className='ml-auto text-sm'>
                    <p>
                        <span className='font-medium'>for sales</span>:
                        sales@bidnow.com.au
                    </p>
                    <p>
                        <span className='font-medium'>for support</span>:
                        support@bidnow.com.au
                    </p>
                    <ul className='list-disc px-6'>
                        <li>8:00am - 6:00pm AEST, Mon - Thurs</li>
                        <li>8:00am - 5:00pm AEST, Fri</li>
                        <li>9:00am - 5:00pm AEST, Sat</li>
                    </ul>
                </section>
            </SectionContainer>
        </footer>
    );
}

export default Footer;
