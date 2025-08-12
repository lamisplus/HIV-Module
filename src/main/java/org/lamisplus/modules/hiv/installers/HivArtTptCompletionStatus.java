package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(20)
@Installer(name = "hiv-art-tpt-completion",
        description = "hiv art tpt completion",
        version = 1)
public class HivArtTptCompletionStatus extends AcrossLiquibaseInstaller {
    public  HivArtTptCompletionStatus() {
        super("classpath:installers/hiv/schema/hiv-art-tpt-completion.xml");
    }
}