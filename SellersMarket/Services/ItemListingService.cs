using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SellersMarket.Models;

namespace SellersMarket.Services
{
    public interface IItemListingService: IDisposable
    {
        string GetItemDetails(FoodItem item);
    }
    public class ItemListingService: IItemListingService
    {
        public ItemListingService() { }

        public string GetItemDetails(FoodItem item)
        {
            var itemDetails = new FoodItemDetails() { ItemName = item.ItemName };
            return itemDetails.ItemName;
        }

        public void Dispose()
        {
        }
    }
}
