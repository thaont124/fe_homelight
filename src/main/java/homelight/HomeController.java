package homelight;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/fe")
public class HomeController {

    @GetMapping("/product/viewAll")
    public String viewProduct(){
        return "viewProduct";
    }

    @GetMapping("/product/edit/{idProduct}")
    public String editProduct(){
        return "editProduct";
    }

    @GetMapping("/product/add")
    public String addProduct(){
        return "addProduct";
    }
}
