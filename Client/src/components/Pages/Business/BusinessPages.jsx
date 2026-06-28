import BusinessCard from "./BusinessCard"

const BusinessPages = (props) => {
    const { Businesses,Filters } = props


    return (<>
        {Businesses.map((business) => {
            return (
                <>
                    {business.scraped
                        ? <><BusinessCard Bid={business.id} key={business.id} />
                            <p className="Seperator"></p></>

                        : <></>}


                </>)
        })}
    </>)
}

export default BusinessPages