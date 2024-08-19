using System.Net.Http;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace CRUDAngularWebAPI.Server.Services
{
    public class CoinListService
    {
        private readonly HttpClient _httpClient;

        public CoinListService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Coin>> GetCoinListAsync()
        {

            string url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,tipoMoeda";

            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<BancoCentralResponse>(content);

                // Mapeando para uma lista simples de moedas
                return result.Value
                             //.Where(c => c.TipoMoeda == "A")  // Por exemplo, filtrar por tipo de moeda se necessário
                             .Select(c => new Coin { Symbol = c.symbol, Type = c.coinType})
                             .ToList();
            }
            return null;
        }
    }

    public class BancoCentralResponse
    {
        [JsonProperty("value")]
        public List<CoinRaw> Value { get; set; }
    }

    public class CoinRaw
    {
        [JsonProperty("simbolo")]
        public string symbol { get; set; }

        [JsonProperty("tipoMoeda")]
        public string coinType { get; set; }
    }

    public class Coin
    {
        public string Symbol { get; set; }
        public string Type { get; set; }
    }
}