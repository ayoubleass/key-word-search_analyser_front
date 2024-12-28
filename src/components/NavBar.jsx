import { useMainContext } from '../context/MainContext';

export default function NavBar ({links})  {
    const {showForm, setShowForm, token} = useMainContext();
    return (<nav className='px-20'>
                <div className='font-bold text-white'>
                { !showForm && !token ? 
                        <h1 className='cursor-pointer'>Keyword Searcher Analyser</h1>
                        : <span className='cursor-pointer' onClick={() => setShowForm(false)}><i className='fa-solid fa-arrow-left'></i> Back</span>
                    } 
                </div>
                <ul>
                    {links.map((l, index) => (<li className={l.cssClasses} key={index} onClick={() => l.action()}><a>{l.name}</a></li>))}
                </ul>
    </nav>)
}