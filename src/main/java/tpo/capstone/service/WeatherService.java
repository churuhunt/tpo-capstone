package tpo.capstone.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Service
public class WeatherService {

    private final Dotenv dotenv = Dotenv.load();
    private final String IP_API_URL = "http://ipinfo.io";
    private final String WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/weather";
    private final String WEATHER_API_KEY = dotenv.get("OPENWEATHER_API_KEY");

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * IP 주소로부터 사용자의 도시 정보를 가져옵니다.
     *
     * @param ip 사용자 IP 주소
     * @return 도시 이름 (예: "Seoul")
     */
    public String getLocationFromIP(String ip) {
        String locationUrl = IP_API_URL + "/" + ip + "/json";
        String response = getApiResponse(locationUrl);

        if (response == null) {
            return null;
        }

        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("city").asText(); // "city" 필드 값 반환
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 도시 이름으로부터 날씨 정보를 가져옵니다.
     *
     * @param city 도시 이름
     * @return 날씨 설명 (예: "clear sky")
     */
    public String getWeatherByCity(String city) {
        String weatherUrl = WEATHER_API_URL + "?q=" + city + "&appid=" + WEATHER_API_KEY;
        String response = getApiResponse(weatherUrl);

        if (response == null) {
            return null;
        }

        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.path("weather").get(0).path("description").asText(); // "weather" 배열의 "description" 값 반환
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 주어진 URL로 API 요청을 보내고 응답을 반환합니다.
     *
     * @param url API 요청 URL
     * @return 응답 문자열
     */
    private String getApiResponse(String url) {
        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
