// src/context/MenuContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { iconsByIndex } from "../../utils/data";
import { ENV_VAR } from "../../utils/envVariables";

const MenuContext = createContext([]);

export const useMenu = () => useContext(MenuContext);

export function MenuProvider({ children }) {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const res = await fetch(`${ENV_VAR.API_URL}/category`);
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();                

                const items = data.data.map((category) => {
                    const subcategories = category.subcategories.map((subcat) => {
                        return {
                            id: category._id,
                            title: subcat.name,
                            icon:subcat.icon,
                            route: subcat.name.replace(/\s+/g, "-").toLowerCase(),
                        };
                    });

                    return {
                        name: category.name,
                        routePath: category.name.toLowerCase(),
                        subcategories,
                    };
                });

                setMenuItems(items);
            } catch (err) {
                console.error(err);
            }
        }

        fetchMenuItems();
    }, []);

    return (
        <MenuContext.Provider value={menuItems}>
            {children}
        </MenuContext.Provider>
    );
}
