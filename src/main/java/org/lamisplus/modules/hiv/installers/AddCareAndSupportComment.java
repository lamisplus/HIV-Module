package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;


@Order(20)
@Installer(name = "add-care-and-support-comment",
        description = "add a comment column hiv_observation table",
        version = 1)
public class AddCareAndSupportComment  extends AcrossLiquibaseInstaller {
    public  AddCareAndSupportComment () {
        super("classpath:installers/hiv/schema/add_comment.xml");
    }
}
