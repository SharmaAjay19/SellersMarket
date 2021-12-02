import {from} from "rxjs";
import { map, catchError, mergeMap } from "rxjs/operators";

var cartState = {
    id: "cart101",
    total_items: 0,
    line_items: [],
    subtotal: 0
};

var productInfo = [
      {
        id: "itemid1",
        name: "Chocolates",
        description: "Cadbury Dairy Milk",
        media: {
          source: "https://economycandy.com/wp-content/uploads/2019/07/products-Cadbury-Dairy-Milk-7oz-Bar-1.jpg",
          type: "image"
        },
        price: {
          raw: 3.99,
          formatted: "3.99",
          formatted_with_symbol: "$3.99",
          formatted_with_code: "3.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid2",
        name: "Chocolates",
        description: "Cadbury Dairy Milk Crackle",
        media: {
          source: "https://www.73mart.com/wp-content/uploads/2021/02/CADBURY-DAIRY-MILK-CRACKLE-CHOCOLATE-BARS-36-GM.jpg",
          type: "image"
        },
        price: {
          raw: 3.99,
          formatted: "3.99",
          formatted_with_symbol: "$3.99",
          formatted_with_code: "3.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid3",
        name: "Chocolates",
        description: "Hershey's Chocolate bar",
        media: {
          source: "https://static01.nyt.com/images/2013/01/13/magazine/13wmt/13wmt-superJumbo-v3.jpg",
          type: "image"
        },
        price: {
          raw: 3.99,
          formatted: "3.99",
          formatted_with_symbol: "$3.99",
          formatted_with_code: "3.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid4",
        name: "Chocolates",
        description: "Nestle Kitkat",
        media: {
          source: "https://static.turbosquid.com/Preview/2020/05/22__05_27_56/1.jpg7A529405-CD52-4D37-B86D-B6082CD55C10DefaultHQ.jpg",
          type: "image"
        },
        price: {
          raw: 2.99,
          formatted: "2.99",
          formatted_with_symbol: "$2.99",
          formatted_with_code: "2.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid5",
        name: "Cakes",
        description: "Raspberry Almond Ice cream cake",
        media: {
          source: "https://www.homecookingadventure.com/images/recipes/raspberry_alomnd_ice_cream_cake_main.jpg",
          type: "image"
        },
        price: {
          raw: 13.99,
          formatted: "13.99",
          formatted_with_symbol: "$13.99",
          formatted_with_code: "13.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid6",
        name: "Cakes",
        description: "Neapolitan Cake",
        media: {
          source: "https://iambaker.net/wp-content/uploads/2012_05_08_999_95.neopolitan-cake-1.jpg",
          type: "image"
        },
        price: {
          raw: 22.99,
          formatted: "22.99",
          formatted_with_symbol: "$22.99",
          formatted_with_code: "22.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid7",
        name: "Cakes",
        description: "Swiss Chocolate cake",
        media: {
          source: "/swisschocolate.png",
          type: "image"
        },
        price: {
          raw: 23.99,
          formatted: "23.99",
          formatted_with_symbol: "$23.99",
          formatted_with_code: "23.99 USD"
        },
        quantity: 0
      },
      {
        id: "itemid8",
        name: "Cakes",
        description: "Napoleon cake",
        media: {
          source: "/napoleon.png",
          type: "image"
        },
        price: {
          raw: 25.99,
          formatted: "25.99",
          formatted_with_symbol: "$25.99",
          formatted_with_code: "25.99 USD"
        },
        quantity: 0
      }
    ];

const fetchItemsRequest = () => {
    let url = "https://takeithome-ordermanagement.azurewebsites.net/api/GetOrders";
    return from(
      fetch(url, {}).then((response) => {
        return response.json().then((data) => {return {
          ok: response.ok,
          status: response.status,
          json: data
        }})
      })
    );
  };


export const getProductInfo = () => {
    return fetchItemsRequest().pipe(map(res => {
        return {data: productInfo};
    }), catchError(err => {alert("Failed to load menu items: " + err.message);}));
};

export const retrieve = () => {
    return cartState
};

export const add = (productId, quantity) => {
    let existing = cartState.line_items.find(x => x.id == productId);
    if (existing) {
        existing.quantity = existing.quantity + quantity;
        cartState.total_items = cartState.total_items + quantity;
    }
    else {
        let productInf = productInfo.find(x => x.id == productId);
        if (productInf) {
            let line_item = {
                id: productInf.id,
                media: productInf.media,
                name: productInf.name,
                line_total: quantity * productInf.price,
                quantity: quantity
            };
            cartState.line_items.push(line_item);
            cartState.total_items = cartState.total_items + quantity;
        }
    }
    return {
        cart: cartState
    };
};

export const update = (productId, quantity) => {
    if (quantity == 0) return remove(productId);
    let existing = cartState.line_items.find(x => x.id == productId);
    if (existing) {
        let diff = quantity - existing.quantity;
        existing.quantity = quantity;
        cartState.total_items = cartState.total_items + diff;
    }
    return {
        cart: cartState
    };
};

export const remove = (productId) => {
    let existingIndex = cartState.line_items.findIndex(x => x.id == productId);
    if (existingIndex >= 0) {
        let existing = cartState.line_items[existingIndex];
        cartState.total_items = cartState.total_items - existing.quantity;
        cartState.line_items.splice(existingIndex, 1);
    }

    return {
        cart: cartState
    };
};

export const empty = () => {
    cartState = {
        id: "cart101",
        total_items: 0,
        line_items: [],
        subtotal: 0
    };
    return {
        cart: cartState
    };
};

export const refresh = () => {
    return cartState;
};