package com.parknexus.Common.context;

import com.parknexus.Common.enums.AccountRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountContext {
    private Integer accountId;
    private AccountRole accountRole;

    private static final ThreadLocal<AccountContext> CONTEXT = new ThreadLocal<>();

    public static void set(AccountContext context) {
        CONTEXT.set(context);
    }

    public static AccountContext get() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
