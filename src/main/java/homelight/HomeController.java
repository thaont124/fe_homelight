package homelight;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/fe")
public class HomeController {
    @GetMapping("/login")
    public String login(){
        return "login";
    }


    @GetMapping("/product/viewAll")
    public String viewProduct(){
        return "product/viewProduct";
    }

    @GetMapping("/product/edit/{idProduct}")
    public String editProduct(){
        return "product/editProduct";
    }

    @GetMapping("/product/add")
    public String addProduct(){
        return "product/addProduct";
    }
}
