using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SellersMarket.Models;

namespace SellersMarket.Services
{
    public interface IItemListingService: IDisposable
    {
        string GetItemDetails(FoodItem item);

        void ConsumeCPU(int percentage);
    }
    public class ItemListingService: IItemListingService
    {
        public ItemListingService() { }

        public string GetItemDetails(FoodItem item)
        {
            Thread.Sleep(10000);
            var itemDetails = new FoodItemDetails() { ItemName = item.ItemName };
            return itemDetails.ItemName;
        }

        public void Dispose()
        {
        }

        public void ConsumeCPU(int percentage)
        {
            if (percentage < 0 || percentage > 100)
                throw new ArgumentException("percentage");
            Stopwatch watch = new Stopwatch();
            watch.Start();
            while (true)
            {
                // Make the loop go on for "percentage" milliseconds then sleep the 
                // remaining percentage milliseconds. So 40% utilization means work 40ms and sleep 60ms
                if (watch.ElapsedMilliseconds > percentage)
                {
                    Thread.Sleep(100 - percentage);
                    watch.Reset();
                    watch.Start();
                }
            }
        }
    }
}
