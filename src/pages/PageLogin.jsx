import React, { useEffect, useState } from "react"
import koop from '../assets/koop.png'
import { data } from "autoprefixer"

const API = 'https://fakestoreapi.com/products/'

export default function PageLogin(){

    const [posts, setPosts] = useState([])

    useEffect(() => {

        let data = false;

        async function fetchData() {

            setPosts([])
            const response = await fetch(API);
            data = await response.json();
            setPosts(data);
            console.log('data -> ', data);
        }

         fetchData();
       

    }, [])

    

    return(
        <div className="bg-koop-def min-h-screen">

            <div className="head fixed bg-sky-500/ w-full ">
                <img className="mx-auto" src={koop} />
                <p className="text-center">+ 10000 des services a votre dispositions</p>
            </div>

            <main className="main-diapo pt-[220px] w-full mx-auto" >

                <div className="flex flex-wrap justify-around" >
                { posts && posts.map((it, i) =>  <div className="max-w-[140px] max-h-[140px] bg-red-400 " ><img className="w-full object-fill"  src={it.image} /></div> )
                }
                </div>
            </main>

        </div>
    )
}