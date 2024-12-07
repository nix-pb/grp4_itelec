import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import ProductListCustomer from '../ProductListCustomer';
import '../Home/index.css';
import Header from '../Header';


const Home = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null); 
    


    const goToOrders = () => 
        {
            navigate('/Orders');
        };



    const goToCartList = () => {
        navigate('/CartList');
    };




    const goToAdminHome = () => {
        navigate('/AdminHome');
    };


    

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId); 
    };



    return (
        <>
            <Header />
            <div className='container'>
                <div className='row'>
                    <button onClick={goToAdminHome} className='admin_button'>Admin Dashboard</button>
                    <button onClick={goToOrders} className='orders_button'>Orders</button>
                    <button onClick={goToCartList} className='orders_button'>Cart</button>
                </div>
            </div>
            <div className='row'>
                <button onClick={() => handleCategoryClick(1)} className='category_buttons'>Hand Tools</button>
                <button onClick={() => handleCategoryClick(2)} className='category_buttons'>Electric Tools</button>
                <button onClick={() => handleCategoryClick(3)} className='category_buttons'>Heavy Tools</button>
            </div>
            
            <div>
                <ProductListCustomer selectedCategory={selectedCategory} />
            </div>
        </>
    );


}

export default Home;
