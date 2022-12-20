import { useRouter } from 'next/router';
import Link from "next/link"
import { Back } from '../icons';
import * as React from 'react';




export default function BreadCrumb({isMain, linkContent = []}) {
    
    const router = useRouter()
    const breadcrumbs = React.useMemo(function generateBreadcrumbs() {
        const asPathWithoutQuery = router.asPath.split("?")[0];
        const asPathNestedRoutes = asPathWithoutQuery.split("/")
                                                     .filter(v => v.length > 0);
    
        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
          const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
          return { href, text: subpath }; 
        })
        const crumblistWithoutMiddlePaths = crumblist.filter((path, index) => {
            return path.text != 'brand' && path.text != 'series' && path.text != 'type'  && path.text != 'product' && index != crumblist.length-1
        })
        const crumblistWithRussianText = crumblistWithoutMiddlePaths.map((path) => {
            return {
                ...path,
                text: path.text.replace(/series/gi, 'Серия').replace(/-/gi, ' ')
            }
        })
        return [{ href: "/", text: "Главная" }, ...crumblistWithRussianText];
      }, [router.asPath]);    

    return (
        <div className={`mt-28 w-full flex flex-wrap overflow-hidden container mx-auto pb-12  ${isMain && 'back-cont-abs'} ` }>
            {breadcrumbs.length ? breadcrumbs.map((crumb) => {
                return (
                    <Link href={crumb.href} key={crumb.href}>
                        <a className='back-btn flex pl-2'>
                            <Back className={`${isMain ? 'back-white': 'back-dark'} `}/>
                            <span className={`back-text capitalize ${isMain ? 'back-white': 'back-dark'}`}>{crumb.text}</span>
                        </a>
                    </Link>
                )
            }): null
            }
            
        </div>
    )
}