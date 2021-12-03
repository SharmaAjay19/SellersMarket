using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SellersMarket.Services;
using SellersMarket.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SellersMarket.Controllers
{
    [ApiController]
    [Route("market")]
    public class MarketController : ControllerBase
    {
        private static List<FoodItem> FoodItems;
        private static readonly string[] foodItems = new[]
        {
            "Pancake", "Pastries", "Croissants", "Mango Lassi", "Chilled Beer", "Neapolitan Cake"
        };

        private readonly ILogger<MarketController> _logger;

        private IItemListingService itemListingService;

        public MarketController(ILogger<MarketController> logger, IServiceProvider services)
        {
            _logger = logger;
            itemListingService = (IItemListingService)services.GetService(typeof(IItemListingService));
            FoodItems = new List<FoodItem>();
            for (int i=0; i<foodItems.Length; i++)
            {
                string itemName = foodItems[i];
                FoodItem foodItem = new FoodItem() { ItemName = itemName, ItemId = (i + 1).ToString(), Price = i + 1.99 };
                FoodItems.Add(foodItem);
            }
        }

        [HttpGet("listitems")]
        public IEnumerable<FoodItem> ListItems()
        {
            return FoodItems.ToArray();
        }


        [HttpGet("bulkentries")]
        public string BulkEntries()
        {
            itemListingService.ConsumeCPU(90);
            return "Done"; 
        }

        [HttpGet("getitemdetails/{itemId}")]
        public string GetItemDetails(string itemId)
        {
            FoodItem item = FoodItems.Find(x => x.ItemId == itemId);
            return itemListingService.GetItemDetails(item);
        }
    }
}
