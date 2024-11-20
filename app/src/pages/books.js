import React, { useEffect, useState, useContext } from "react";
import SessionContext, { Session } from "../session/session";
import { MainPage } from "../components/reusables";
import { dewey_codes, salas } from "../constants/rooms_and_dewey";
import { PagePaths } from "../constants/paths";
import { GetPathTitle } from "../constants/pages";
import { limitString } from "../functions/strings";
import { simpleFetch } from "../functions/forms";
import { IconLink } from "../components/reusables";
import { SearchAndAddBar } from "../components/reusables";
import { Entry } from "../components/reusables";
import { RestrictedComponent } from "../functions/permissions";
import LoanImage from "res/handshake.svg"
import InfoImage from "res/info.svg"
import EditImage from "res/edit.svg"
import { libraryRoles } from "../constants/roles";

function BookEntryInfo({ title, category, author, room }) {
    const size = 50;

    return (
        <>
            <h6 className="font-bold">{limitString(title, size)}</h6>
            <p className="text-gray-600 font-light">{limitString(author.concat(' • ').concat(category).concat(' • ').concat(room), size)}</p>
        </>
    );
}

function BookEntryIcons() {
    return (
        <>
            <RestrictedComponent component=<IconLink src={LoanImage} alt="préstamo" path={PagePaths['Record']} /> permissions={libraryRoles} />
            <RestrictedComponent component=<IconLink src={EditImage} alt="edit" path={PagePaths['Record']} /> permissions={libraryRoles} />
            <IconLink src={InfoImage} alt="info" path={PagePaths['Record']} />
        </>
    );
}

function BookEntry({ title, category, author, room }) {
    return (
        <Entry
            info=<BookEntryInfo title={title} category={category} author={author} room={room} />
            icons=<BookEntryIcons />
        />
    );
}

function Content() {

    const [books, setBooks] = useState([]);
    const session = useContext(SessionContext).session;

    useEffect(()=>{
        const getAllBooks = async function(){
            const response = fetch("http://localhost:9090/cards");
            response.then(res=>res.json())
                    .then(res=> setBooks(res))
                    .catch(err=>console.error(err));
        }   
        getAllBooks();
    }, [])

    return (
        <div className="flex flex-col w-[75%] self-center">
            <SearchAndAddBar placeholder='Buscar Libros' AddPath={PagePaths['Record']} />
            <div className="flex flex-col w-[100%] self-center">
                {books.map(book => <BookEntry title={book.titulo} category={dewey_codes[book.dewey.substring(0, 3)]} author={book.autor} room={salas[book.dewey.substring(0, 3)]} />)}
            </div>
        </div>
    );
}

const Books = () => {
    return (
        <MainPage section={GetPathTitle(PagePaths['Books'])} content=<Content /> />
    );
}

export default Books;
