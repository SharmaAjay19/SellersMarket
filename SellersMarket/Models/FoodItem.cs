using System;

namespace SellersMarket.Models
{
    public class FoodItem
    {
        public string ItemName { get; set; }

        public string ItemId { get; set; }

        public double Price { get; set; }
    }

    public class FoodItemDetails
    {
        private string SystemItemName;
        public string ItemName
        {
            get { return "ItemName: " + ItemName; }
            set { this.SystemItemName = value; }
        }
    }
}
