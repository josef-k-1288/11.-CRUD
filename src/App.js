import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'http://localhost:3500/items';
  const [items, setItems] = useState([]); // iniciramo praznim array-em(ako je lista prazna imace prazan string koji ce omoguciti rad aplikacije)
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 


  //console.log('before useEffect') // prvo se prikazuje 

  //useEffect(() => { // svaki put kad se komponenta renderuje(prikazuje) useEffect je pokrenut
  //  console.log('inside useEffect'); // trece
  //},[items]) //  niz dependecis omogucava da se useEffect prikaze samo 
  
  //console.log('after useEffect') // drugo (asinhrono)


  useEffect(() => { 
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL); // await se koristi za čekanje na Promise (cekamo API_URL)
        if (!response.ok) throw Error('Did not receive expacted data'); 
        const listItems = await response.json(); // cekamo odgovor u jsonu
        //console.log(listItems);
        setItems(listItems); // uzimamo iteme
        setFetchError(null); 
      } catch (err) {
        //console.log(err.message);
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    setTimeout(() => {
      (async () => await fetchItems())(); 
    }, 2000)
   
  }, [])  
  
  




// const setAndSaveItems = (newItems) => {
//   setItems(newItems);
  
// }

const addItem = async (item) => {
  const id = items.length ? items[items.length - 1].id + 1 : 1; // ako duzina unetig slova nije nula treba da bude 1?
  const myNewItem = { id, checked: false, item}; // ckecked polje dodatog itema ce uvek biti false
  const listItems = [...items, myNewItem]; // spread operator items nam omogućava da brzo kopiramo ceo ili deo postojećeg niza ili objekta u drugi niz ili objekat.
  setItems(listItems);

  const postOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(myNewItem)
  }
  const result = await apiRequest(API_URL, postOptions);
  if (result) setFetchError(result);
}

const handleCheck = async (id) => {
  //console.log(`key: ${id}`)
  const listItems = items.map((item) => item.id === id ? { // Funkcija map() se koristi za ponavljanje niza i manipulisanje ili promenu stavki podataka. U React-u, funkcija map() se najčešće koristi za prikazivanje liste podataka u DOM-u.
      ...item,
      checked: !item.checked
  } : item);
  setItems(listItems);

  const myItem = listItems.filter((item) => item.id === id);
  const updateOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ checked: myItem[0].checked })
  };
  const reqUrl = `${API_URL}/${id}`;
  const result = await apiRequest(reqUrl, updateOptions);
  if (result) setFetchError(result);
}


const handleDelete = async (id) => {
  // console.log(id)
  const listItems = items.filter((item) => item.id !== id) // filter ce stvoriti novi niz i on ce imati samo id-ove koji nisu jednaki id-ju itema
  setItems(listItems);
  //localStorage.setItem('shoppinglist', JSON.stringify(listItems)); // cuva u lokalnoj memoriji

  const deleteOptions = { method: 'DELETE' };
  const reqUrl = `${API_URL}/${id}`;
  const result = await apiRequest(reqUrl, deleteOptions);
  if (result) setFetchError(result);

}

const handleSubmit = (e) => {
  e.preventDefault(); // sprecava refresh stranice
  if(!newItem) return;
  addItem(newItem);
  setNewItem('');
  //console.log('submitted');
}

  return (
    <div className="App">
        <Header title="Groceries"/>
        <AddItem 
          newItem={newItem}
          setNewItem={setNewItem}
          handleSubmit={handleSubmit}
        />
        <SearchItem
          search={search}
          setSearch={setSearch}
        />
        {/* <Header /> */}
        <main>
          {isLoading && <p>Loading Items...</p>}
          {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content // poziva iz Content komponente sve njegove iteme
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
        </main>
        <Footer length={items.length} />
    </div>
  );
}

export default App;
