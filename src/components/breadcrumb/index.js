import Router, { useRouter } from 'next/router';
import Link from "next/link"
import { Back } from '../icons';
import {useMemo} from 'react';
import { capitalized } from '../../utils/miscellaneous';

export default function BreadCrumb({isAbs, typeContentName}) {
    
    const router = useRouter()
    const breadcrumbs = useMemo(function generateBreadcrumbs() {
        const asPathWithoutQuery = router.asPath.split("?")[0];
        const asPathNestedRoutes = asPathWithoutQuery.split("/")
                                                     .filter(v => v.length > 0);
    
        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
          const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
          return { href, text: subpath }; 
        })
        const crumblistWithoutMiddlePaths = crumblist.filter((path, index) => {
            return path.text != 'brand' && path.text != 'series' && path.text != 'type' && path.text != 'product' && !path.text.includes('#')
        })
        /* const crumblistWithoutLastItem = crumblistWithoutMiddlePaths.filter((path, index) => {
            return index != crumblistWithoutMiddlePaths.length-1
        }) */
        const crumblistWithRussianText = crumblistWithoutMiddlePaths.map((path, index) => {
            let text = path.text.replace(/series/gi, 'Серия').replace(/-/gi, ' ').replace(/seriya/gi, 'Серия')
            if (!typeContentName) {
                if (text.includes('lamps')) {
                    text = 'Светильники'
                } else if (text.includes('tracks')) {
                    text = 'Шинопроводы'
                } else if (text.includes('accessory')) {
                    text = 'Аксессуары'
                } else if (text.includes('osnovanie dlya svetilnikov')) {
                    text = 'Основание для светильников'
                } 
            } else {
                if (index == crumblistWithoutMiddlePaths.length-1) {
                    text = typeContentName
                }
            }
            return {
                ...path,
                text: text
            }
        })
        return [{ href: "/", text: "Главная" }, ...crumblistWithRussianText];
      }, [router.asPath, typeContentName]);    

    return (
        <div className={`mt-28 w-full flex flex-wrap overflow-hidden container mx-auto pb-6 sm:pb-12 px-2 ${isAbs && 'back-cont-abs'} ` }>
            {breadcrumbs.length > 2? breadcrumbs.map((crumb) => {
                return (
                    <Link href={crumb.href} key={crumb.href}>
                        <a className='back-btn flex pr-2 mb-2'>
                            <Back className={`${isAbs ? 'back-white': 'back-dark'} `}/>
                            <span className={`back-text ${isAbs ? 'back-white': 'back-dark'}`}>{capitalized(crumb.text)}</span>
                        </a>
                    </Link>
                )
            }): <button onClick={() => Router.back()} className='back-btn flex'>
                    <Back className={`${isAbs ? 'back-white': 'back-dark'} `}/>
                    <span className={`back-text ${isAbs ? 'back-white': 'back-dark'}`}>Назад</span>
                </button>
            }
            
        </div>
    )
}