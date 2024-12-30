import { useMainContext } from '../context/MainContext';
import { useNavigate, useLocation } from 'react-router-dom';
import image from '../assets/images/image.webp'

export default function NavBar ()  {
    const navigate = useNavigate();
    const location = useLocation();
    const {showForm, setShowForm, token, setToken} = useMainContext();
     const links = [
        {
            name: 'Home',
            incone: '',
            action : () => navigate('/'),
            cssClasses : location.pathname  === '/' ? 'font-bold' : '' 
        },
        {
            name: 'About us',
            incone: '',
            action : () => navigate('/'),
            cssClasses : location.pathname  === '/About_us' ? 'font-bold' : '' 
        },
        {
            name : 'Connexion',
            icon : '',
            action : () =>  setShowForm(true),
            cssClasses : showForm ?  'font-bold' : 'opacity-1 cursor-pointer '  
        },
        {
            name : 'Logout',
            icon : '',
            action : () =>  setToken(''),
            cssClasses : token ?  'opacity-1 cursor-pointer ' : 'hidden '
        },
      
    ];


    return (<nav className='px-20 h-[15vh] flex justify-between	items-center text-white'>
                <div className='text-white'>
                { !showForm ? 
                        <img src={image}/>
                        : ''
                    } 
                </div>
                <ul>
                    {links.map((l, index) => {
                            return l.name === 'Connexion' && token ?
                                ''
                            : <li className={l.cssClasses} key={index} onClick={() => l.action()}><a>{l.name}</a></li>
                    })}
                </ul>
    </nav>)
}